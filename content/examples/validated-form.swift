import SwiftUI

struct ValidatedFormExample: View {
    @State private var name = ""
    @State private var attempted = false
    @State private var message = ""
    @FocusState private var nameFocused: Bool

    private var invalid: Bool {
        name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    var body: some View {
        Form {
            Text("Local validation demo. No data is sent or saved.")
            TextField("Display name (required)", text: $name)
                .focused($nameFocused)
            if attempted && invalid {
                Text("Enter a display name.")
                    .foregroundStyle(.red)
            }
            Button("Check name") {
                attempted = true
                if invalid {
                    message = ""
                    nameFocused = true
                } else {
                    message = "Name is valid. Nothing has been saved."
                }
            }
            if !message.isEmpty { Text(message) }
        }
        .onChange(of: name) { _, _ in message = "" }
    }
}
